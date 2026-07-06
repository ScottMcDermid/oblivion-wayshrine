/**
 * Spell Codec — encodes/decodes the spell altar state into a compact,
 * URL-safe string using binary packing + lz-string compression.
 *
 * Encoding format (v1):
 *   Byte 0: version (1)
 *   Then bit-packed fields:
 *     - 6 x 7 bits: school skills (Alteration, Conjuration, Destruction, Illusion, Mysticism, Restoration)
 *     - 7 bits: luck (0-127)
 *     - 4 bits: effect count (0-15)
 *     - Per effect:
 *       - 7 bits: effect definition index (into spellEffectDefinitions array)
 *       - 2 bits: range (0=Self, 1=Touch, 2=Target)
 *       - 7 bits: magnitude (0-100)
 *       - 7 bits: area (0-100)
 *       - 7 bits: duration (0-120)
 *       - 1 bit: has attribute flag
 *       - if set: 3 bits attribute index (0-7)
 *       - 1 bit: has skill flag
 *       - if set: 5 bits skill index (0-20)
 *       - 1 bit: has lock level flag
 *       - if set: 3 bits lock level index (0-4)
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import {
  type School,
  type SpellEffect,
  type SpellEffectRange,
  type Attribute,
  type Skill,
  type LockLevel,
  schools,
  spellEffectDefinitions,
  attributes,
  skills as allSkills,
  lockLevels,
  getMagickaCost,
  spellEffectDefinitionById,
} from '@/utils/spellEffectUtils';

const CODEC_VERSION = 1;

const ranges: SpellEffectRange[] = ['Self', 'Touch', 'Target'];

// Build lookup maps for fast encoding
const effectIndexById: Record<string, number> = {};
for (let i = 0; i < spellEffectDefinitions.length; i++) {
  effectIndexById[spellEffectDefinitions[i].id] = i;
}

// ─── Bit Writer / Reader ────────────────────────────────────────────────────

class BitWriter {
  private buffer: number[] = [];
  private currentByte = 0;
  private bitPos = 0;

  writeBits(value: number, numBits: number): void {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitPos = 0;
      }
    }
  }

  toUint8Array(): Uint8Array {
    const result = [...this.buffer];
    if (this.bitPos > 0) {
      result.push(this.currentByte << (8 - this.bitPos));
    }
    return new Uint8Array(result);
  }
}

class BitReader {
  private data: Uint8Array;
  private bytePos = 0;
  private bitPos = 0;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  readBits(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      const byte = this.data[this.bytePos];
      const bit = (byte >> (7 - this.bitPos)) & 1;
      value = (value << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bytePos++;
        this.bitPos = 0;
      }
    }
    return value;
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SpellData {
  skills: Record<School, number>;
  luck: number;
  effects: SpellEffect[];
}

// ─── Encode ─────────────────────────────────────────────────────────────────

export function encodeSpell(data: SpellData): string {
  const writer = new BitWriter();

  // Version (8 bits)
  writer.writeBits(CODEC_VERSION, 8);

  // Skills (6 x 7 bits, in schools order)
  for (const school of schools) {
    writer.writeBits(Math.min(data.skills[school], 127), 7);
  }

  // Luck (7 bits)
  writer.writeBits(Math.min(data.luck, 127), 7);

  // Effect count (4 bits, max 15)
  const count = Math.min(data.effects.length, 15);
  writer.writeBits(count, 4);

  // Per effect
  for (let i = 0; i < count; i++) {
    const effect = data.effects[i];

    // Effect definition index (7 bits)
    const effectIdx = effectIndexById[effect.id] ?? 0;
    writer.writeBits(effectIdx, 7);

    // Range (2 bits)
    const rangeIdx = ranges.indexOf(effect.range);
    writer.writeBits(rangeIdx >= 0 ? rangeIdx : 0, 2);

    // Magnitude (7 bits, 0-100)
    writer.writeBits(Math.min(effect.magnitude, 127), 7);

    // Area (7 bits, 0-100)
    writer.writeBits(Math.min(effect.area, 127), 7);

    // Duration (7 bits, 0-120)
    writer.writeBits(Math.min(effect.duration, 127), 7);

    // Attribute (1 flag bit + 3 index bits if set)
    if (effect.attribute) {
      writer.writeBits(1, 1);
      const attrIdx = attributes.indexOf(effect.attribute);
      writer.writeBits(attrIdx >= 0 ? attrIdx : 0, 3);
    } else {
      writer.writeBits(0, 1);
    }

    // Skill (1 flag bit + 5 index bits if set)
    if (effect.skill) {
      writer.writeBits(1, 1);
      const skillIdx = allSkills.indexOf(effect.skill);
      writer.writeBits(skillIdx >= 0 ? skillIdx : 0, 5);
    } else {
      writer.writeBits(0, 1);
    }

    // Lock level (1 flag bit + 3 index bits if set)
    if (effect.lockLevel) {
      writer.writeBits(1, 1);
      const lockIdx = lockLevels.indexOf(effect.lockLevel);
      writer.writeBits(lockIdx >= 0 ? lockIdx : 0, 3);
    } else {
      writer.writeBits(0, 1);
    }
  }

  // Compress
  const bytes = writer.toUint8Array();
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
  return compressToEncodedURIComponent(binaryString);
}

// ─── Decode ─────────────────────────────────────────────────────────────────

export function decodeSpell(code: string): SpellData | null {
  try {
    const binaryString = decompressFromEncodedURIComponent(code);
    if (!binaryString) return null;

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const reader = new BitReader(bytes);

    // Version
    const version = reader.readBits(8);
    if (version !== 1) return null;

    // Skills
    const skills = {} as Record<School, number>;
    for (const school of schools) {
      skills[school] = reader.readBits(7);
    }

    // Luck
    const luck = reader.readBits(7);

    // Effect count
    const count = reader.readBits(4);

    // Effects
    const effects: SpellEffect[] = [];
    for (let i = 0; i < count; i++) {
      // Effect definition index
      const effectIdx = reader.readBits(7);
      if (effectIdx >= spellEffectDefinitions.length) return null;
      const definition = spellEffectDefinitions[effectIdx];

      // Range
      const rangeIdx = reader.readBits(2);
      const range: SpellEffectRange = ranges[rangeIdx] ?? 'Self';

      // Magnitude
      const magnitude = reader.readBits(7);

      // Area
      const area = reader.readBits(7);

      // Duration
      const duration = reader.readBits(7);

      // Attribute
      const hasAttribute = reader.readBits(1);
      let attribute: Attribute | undefined;
      if (hasAttribute) {
        const attrIdx = reader.readBits(3);
        attribute = attributes[attrIdx];
      }

      // Skill
      const hasSkill = reader.readBits(1);
      let skill: Skill | undefined;
      if (hasSkill) {
        const skillIdx = reader.readBits(5);
        skill = allSkills[skillIdx];
      }

      // Lock level
      const hasLockLevel = reader.readBits(1);
      let lockLevel: LockLevel | undefined;
      if (hasLockLevel) {
        const lockIdx = reader.readBits(3);
        lockLevel = lockLevels[lockIdx];
      }

      // Recalculate magickaCost from the definition and decoded values
      const magickaCost = getMagickaCost({
        baseCost: spellEffectDefinitionById[definition.id].baseCost,
        isLevelBasedMagnitude: spellEffectDefinitionById[definition.id].isLevelBasedMagnitude,
        magnitude,
        area,
        duration,
        range,
      });

      effects.push({
        id: definition.id,
        range,
        magnitude,
        area,
        duration,
        magickaCost,
        ...(attribute && { attribute }),
        ...(skill && { skill }),
        ...(lockLevel && { lockLevel }),
      });
    }

    return { skills, luck, effects };
  } catch {
    return null;
  }
}
