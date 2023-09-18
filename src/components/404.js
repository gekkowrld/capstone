import React from 'react';

const PageNotFound = () => {
  const currentUrl = window.location.pathname;
  console.log(currentUrl);
  return (
    <div className="flex items-center justify-center flex-col">
		<p className='text-gray-600' >{currentUrl}</p>
      <div className="bg-white p-8 rounded-lg shadow-md flex items-center flex-col">
        <h1 className="text-4xl font-semibold text-gray-800">Oops! Page Not Found</h1>
        <p className="text-gray-600 mt-2 flex-wrap max-w-lg">Looks like you went to the wrong isle</p>
        <a href="/" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
          Back to Home
        </a>
      </div>
    </div>
  );
};

export default PageNotFound;
