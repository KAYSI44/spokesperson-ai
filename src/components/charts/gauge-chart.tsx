'use client';

import styles from '@/styles/gauge-chart.module.scss';
import { useEffect, useRef } from 'react';
import { type Selection, easeElastic, select, arc as arcFn } from 'd3';
import { degToRad } from 'three/src/math/MathUtils.js';
import { percToDeg } from '@/lib/statistics';
import { cn } from '@/lib/utils';

interface IGaugeProps {
  percent: number;
  className?: string;
}

export default function GaugeChart({ percent, className }: IGaugeProps) {
  const margin = { top: 20, right: 20, bottom: 30, left: 20 };
  const barWidth = 40;
  const numSections = 3;
  const sectionPerc = 1 / numSections / 2;
  const padRad = 0.05;
  const chartInset = 10;
  const totalPercentRef = useRef(0.75);

  const containerRef = useRef<HTMLElement>();

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';
    totalPercentRef.current = 0.75;

    const width = containerRef.current.offsetWidth - margin.left - margin.right;
    const height = width;
    const radius = Math.min(width, height) / 2;

    const percToDeg = (perc: number) => perc * 360;

    const percToRad = (perc: number) => degToRad(percToDeg(perc));

    const degToRad = (deg: number) => (deg * Math.PI) / 180;

    const svg = select(containerRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    const chart = svg
      .append('g')
      .attr(
        'transform',
        `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`,
      );

    for (let sectionIndx = 1; sectionIndx <= numSections; sectionIndx++) {
      const startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
      const endPadRad = sectionIndx === numSections ? 0 : padRad / 2;

      const arc = arcFn()
        .outerRadius(radius - chartInset)
        .innerRadius(radius - chartInset - barWidth)
        .startAngle(percToRad(totalPercentRef.current) + startPadRad)
        .endAngle(percToRad(totalPercentRef.current + sectionPerc) - endPadRad);

      chart
        .append('path')
        .attr(
          'class',
          `${styles['arc']} ${styles[`chart-color${sectionIndx}`]}`,
        )
        .attr('d', arc as any);

      totalPercentRef.current += sectionPerc;
    }
    const needle = new Needle(90, 15, percent);
    needle.drawOn(chart, 0);
    needle.animateOn(chart, percent);
  }, [percent]);

  return (
    <div
      ref={(el) => (containerRef.current = el as HTMLElement)}
      className={cn(className)}
    />
  );
}

class Needle {
  constructor(
    public len: number,
    public radius: number,
    public percent: number,
  ) {}

  drawOn(el: Selection<SVGGElement, unknown, null, undefined>, perc: number) {
    el.append('circle')
      .attr('class', styles['needle-center'])
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', this.radius);

    el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
  }
  animateOn(el: Selection<SVGGElement, unknown, null, undefined>, _: number) {
    el.transition()
      .delay(500)
      .ease(easeElastic)
      .duration(3000)
      .selectAll('.needle')
      .attrTween('d', (d) => {
        return (percentOfPercent) => {
          return this.mkCmd(percentOfPercent * this.percent);
        };
      });
  }
  mkCmd(perc: number): string {
    const thetaRad = degToRad(percToDeg(perc) / 2);
    const centerX = 0;
    const centerY = 0;

    const topX = centerX - this.len * Math.cos(thetaRad);
    const topY = centerY - this.len * Math.sin(thetaRad);
    const leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
    const leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
    const rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
    const rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);

    return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
  }
}
