import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Checkbox,
} from "@material-tailwind/react";

export default function BlockSites({
  onBlockSitesClick,
}: {
  onBlockSitesClick: () => void;
}) {
  const [inputValue, setInputValue] = useState("");
  const [websites, setWebsites] = useState<{ url: string; favicon: string }[]>(
    []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    chrome.storage.sync.get("websites", (result) => {
      if (result.websites) {
        setWebsites(result.websites);
      }
    });
  }, []);

  const isValidURL = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      if (websites.some((site) => new URL(site.url).hostname === hostname)) {
        setError("This URL is already in the list.");
        return false;
      }
      return true;
    } catch {
      setError("Please enter a valid URL: https://example.com/");
      return false;
    }
  };

  const handleAddWebsite = () => {
    let formattedInputValue = inputValue.trim();

    if (!formattedInputValue) {
      setError("URL cannot be empty.");
      return;
    }

    if (
      !formattedInputValue.startsWith("http://") &&
      !formattedInputValue.startsWith("https://")
    ) {
      formattedInputValue = `https://${formattedInputValue}`;
    }

    if (!formattedInputValue.endsWith("/")) {
      formattedInputValue += "/";
    }

    if (!isValidURL(formattedInputValue)) {
      return;
    }
    setError("");

    const hostname = new URL(formattedInputValue).hostname;

    const updatedWebsites = [
      ...websites,
      {
        url: formattedInputValue,
        favicon: `https://www.google.com/s2/favicons?sz=64&domain_url=${hostname}`,
      },
    ];
    setWebsites(updatedWebsites);
    chrome.storage.sync.set({ websites: updatedWebsites }, () => {});

    setInputValue("");
  };

  const handleDeleteWebsite = (hostName: string) => {
    const updatedWebsites = websites.filter((site) => site.url !== hostName);
    setWebsites(updatedWebsites);

    chrome.storage.sync.set({ websites: updatedWebsites }, () => {});

    setInputValue("");
  };

  return (
    <>
      <div className="relative flex items-center justify-center w-full bg-gradient-to-t from-custom_red-400 to-custom_red-500">
        <button className="absolute left-4" onClick={onBlockSitesClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Centered Heading */}
        <h1 className="pt-6 pb-6 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
          Block Sites
        </h1>
      </div>
      <Card
        className="h-full w-full"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <CardHeader
          floated={false}
          shadow={false}
          className="mb-2 rounded-none px-4 pb-4"
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="w-full md:w-96">
            <div className="mt-4 flex items-center space-x-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddWebsite();
                  }
                }}
                placeholder="Enter a website URL (e.g. https://example.com)"
                className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:ring-custom_red-700 bg-transparent"
              />
              <button
                onClick={handleAddWebsite}
                className="bg-custom_red-500 hover:bg-custom_red-700 text-white font-bold py-2 px-4 rounded-full"
              >
                Add
              </button>
            </div>
          </div>
        </CardHeader>

        {error && (
          <div className="flex flex-col items-center">
            <p className="font-bold text-red-500 text-sm mb-4">{error}</p>
          </div>
        )}

        <div className="overflow-y-auto max-h-[300px]">
          {websites.length > 0 && (
            <table className="w-full bg-white rounded shadow-sm">
              <tbody>
                {websites.map((website, index) => (
                  <tr key={index} className="border-b pb-6">
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                          crossOrigin={undefined}
                        />
                        <img
                          src={website.favicon}
                          alt="Favicon"
                          className="w-6 h-6"
                        />
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                          placeholder={undefined}
                          onPointerEnterCapture={undefined}
                          onPointerLeaveCapture={undefined}
                        >
                          <a
                            href={website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {website.url}
                          </a>
                        </Typography>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteWebsite(website.url)}
                          className="bg-red-500 text-white px-4 py-2 rounded-full font-bold hover:bg-red-600 "
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </>
  );
}
