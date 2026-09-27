import { BadRequestException } from '@nestjs/common';
import type { NormalizedVibeItem } from '../contracts/integration-provider';

export function assertNormalizedVibeItems(
  source: string,
  items: NormalizedVibeItem[],
): void {
  if (!source.trim() || source.length > 64) {
    throw new BadRequestException('Источник Vibe-элемента указан неверно');
  }

  const seen = new Set<string>();
  for (const item of items) {
    if (item.source !== source) {
      throw new BadRequestException(
        'Источник элемента не совпадает с интеграцией',
      );
    }
    if (!item.category.trim() || item.category.length > 64) {
      throw new BadRequestException('Категория Vibe-элемента указана неверно');
    }
    if (!item.sourceItemId.trim() || item.sourceItemId.length > 200) {
      throw new BadRequestException('Внешний id Vibe-элемента указан неверно');
    }
    if (!item.name.trim() || item.name.length > 300) {
      throw new BadRequestException('Название Vibe-элемента указано неверно');
    }
    if (
      item.weight !== null &&
      (!Number.isFinite(item.weight) || item.weight < 0 || item.weight > 1)
    ) {
      throw new BadRequestException(
        'Вес Vibe-элемента должен быть пустым или числом от 0 до 1',
      );
    }
    if (seen.has(item.sourceItemId)) {
      throw new BadRequestException('Повторяющийся внешний id Vibe-элемента');
    }
    seen.add(item.sourceItemId);
  }
}
