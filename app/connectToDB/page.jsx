import React from 'react';

const Page = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Connect to DB</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-900 text-white p-4 rounded-lg flex items-center justify-center h-32 w-32">
            Db1
          </div>
          <div className="bg-blue-900 text-white p-4 rounded-lg flex items-center justify-center h-32 w-32">
            Db2
          </div>
          <div className="bg-blue-900 text-white p-4 rounded-lg flex items-center justify-center h-32 w-32">
            Db3
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
