import React, { useState } from "react";
import CountDown from "./CountDown";
import BlockSites from "./BlockSites";

function App() {
  const [showBlockSites, setShowBlockSites] = useState(false);

  const handleShowBlockSites = () => {
    setShowBlockSites(!showBlockSites);
  };

  return (
    <>
      <div
        className="w-[450px] h-[500px] flex flex-col justify-center items-center overflow-hidden"
        id="root"
      >
        {showBlockSites ? (
          <BlockSites onBlockSitesClick={handleShowBlockSites} />
        ) : (
          <>
            <h1 className="w-full pt-6 pb-6 mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white bg-gradient-to-t from-custom_red-400 to-custom_red-500 text-center">
              Lock In
            </h1>
            <CountDown onBlockSitesClick={handleShowBlockSites} />
          </>
        )}
      </div>
    </>
  );
}

export default App;
