"use client";

import "./i18n";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function Home() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              🐠 AquaTracker
            </h1>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("welcome")}
          </h2>
          <p className="text-gray-600 mb-8">
            {t("description")}
          </p>
          
          {/* Simple Menu */}
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-64">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("myAquariums")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("aquariumsDesc")}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-64">
              <div className="text-4xl mb-4">🐠</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("fishDatabase")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("fishDesc")}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-64">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("plantsDatabase")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("plantsDesc")}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow w-64">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t("statistics")}
              </h3>
              <p className="text-gray-600 text-sm">
                {t("statsDesc")}
              </p>
            </div>
          </div>
          
          {/* Login Button */}
          <div className="mt-12">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              {t("getStarted")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
