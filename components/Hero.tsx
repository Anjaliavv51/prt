/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Spotlight } from './ui/Spotlight'
import { TextGenerateEffect } from './ui/TextGenerateEffect'
import MagicButton from './MagicButton'
import { FaLocationArrow } from 'react-icons/fa'
import { BackgroundLines } from './ui/background-lines'
import { ProfileData } from '@/lib/portfolio-data'

interface HeroProps {
  data?: ProfileData;
}

const Hero = ({ data }: HeroProps) => {
  const name = data?.name || 'PAMIDI LAKSHMI PAVANANJALI';
  const headline = data?.headline || 'Transforming Concepts into Seamless User Experiences';
  const bio = data?.bio || "Hi, I'm Pavananjali, a Web Developer, Open Source, AIML and Robotics Enthusiast.";
  const dpImage = data?.dpImage || '/dp.jpg';
  const ctaText = data?.ctaText || 'Show my work';

  return (
    <div className='pb-20 pt-36'>
        <div>
            <Spotlight className='-top-40 -left-10 
            md:-left-32 md:-top-20 h-screen' fill="white"/>
            <Spotlight className='top-10 left-full h-[80vh] 
            w-[50vw]' fill="purple"/>
            <Spotlight className='top-28 left-80 h-[80vh] 
            w-[50vw]' fill="blue"/>
        </div>

        <div className="h-screen w-full dark:bg-black-100 bg-white  
        dark:bg-grid-white/[0.1] bg-grid-black/[0.2]
        flex items-center justify-center absolute top-0 left-0">
      <div className="absolute pointer-events-none inset-0 
      flex items-center justify-center dark:bg-black-100 
      bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"/>
    </div>
    <div className='flex justify-center relative my-20
    z-10'>
        <div className='max-w-[89vw] md:max-w-2xl
        lg:max-w-[60vw] flex flex-col items-center
        justify-center'> 
        <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
        <img
            src={dpImage}
            alt="profile-pic"
            className="rounded-full w-80 h-80 border-2 border-white-100 mb-5 object-cover"
          />
            <h1 className='uppercase tracking-widest
            text-xs text-center text-blue-100 max-w-80'>
                {name}
            </h1>
            <TextGenerateEffect 
            className='text-center text-[80px] md:text-5xl lg:text-6xl' words={headline} />
            <p className='text-center md:tracking-wider
            mb-4 text-sm md:text-lg lg:text-2xl'>
            {bio}
            </p>
            <a href="#about">
              <MagicButton title={ctaText} 
              icon={<FaLocationArrow/>} 
              position={'right'}/>
            </a>
            </BackgroundLines>
        </div>
    </div>
    </div>
  )
}

export default Hero