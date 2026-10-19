"use client";
import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/BentoGrid'
import { gridItems as defaultGridItems } from '@/data'
import { GridItem } from '@/lib/portfolio-data'

interface GridProps {
  gridItems?: GridItem[];
  resumeLink?: string;
}

const Grid = ({ gridItems, resumeLink }: GridProps) => {
  const displayItems = gridItems && gridItems.length > 0 ? gridItems : defaultGridItems;

  return (
    <section id='about'>
      <BentoGrid>
        {displayItems.map(({id, title, titleClassName, description, className, img, imgClassName, spareImg})=>(
          <BentoGridItem 
            id={id}
            key={id}
            title={title}
            titleClassName={titleClassName}
            description={description}
            className={className}
            img={img}
            imgClassName={imgClassName}
            spareImg={spareImg}
            resumeLink={resumeLink}
          />
        ))}
      </BentoGrid>
    </section>
  )
}

export default Grid