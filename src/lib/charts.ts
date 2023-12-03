import { faker } from '@faker-js/faker';
import { type ChartArea } from 'chart.js';

const colors = [
  'red',
  'orange',
  'yellow',
  'lime',
  'green',
  'teal',
  'blue',
  'purple',
];

export function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea) {
  const colorStart = faker.helpers.arrayElement(colors);
  const colorMid = faker.helpers.arrayElement(
    colors.filter((color) => color !== colorStart),
  );
  const colorEnd = faker.helpers.arrayElement(
    colors.filter((color) => color !== colorStart && color !== colorMid),
  );

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(0, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(1, colorEnd);

  return gradient;
}
