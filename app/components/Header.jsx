"use client"
import Image from 'next/image';
import React from 'react';
import AI from '../../public/images/ai.webp';

const Header = () => {
  return (
    <header className="bg-blue-900 text-white py-4 pt-16 ">
      <div className="container mx-auto flex">
        <div className='my-10'>
        <h1 className="text-4xl font-bold">Welcome to tok2dbs (Talk to Databases of Biomedical Science)</h1>
        <p className="mt-2 text-2xl">Revolutionizing Data Access for Biomedical and Clinical Researchers</p>
        </div>
        <div>
          <Image className="rounded-lg" src={AI} alt="AI" width={500} height={500} />
          
        </div>
      </div>
    </header>
  );
};

export default Header;
