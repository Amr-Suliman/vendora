'use client'

export default function Loading() {
  return (
    <div
      className=" relative overflow-hidden  min-h-[calc(100vh-102px)] pt-25  bg-white dark:bg-neutral-950
        transition-colors duration-300">

      {/* Soft animated glow */}
      <div
        className="
          absolute w-96 h-96 rounded-full blur-3xl animate-pulse
          bg-black/5 dark:bg-white/5"/>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">

        {/* Logo */}
        <div className="flex items-center gap-4">
          <div
            className=" w-14 h-14 sm:w-16 sm:h-16 bg-black text-white dark:bg-white dark:text-black
              flex items-center justify-center rounded-2xl text-3xl sm:text-4xl font-extrabold shadow-lg transition-colors">
            V
          </div>

          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-wide text-black dark:text-white transition-colors" >
            VEND◯RA
          </h1>
        </div>

        {/* Progress Bar */}
        <div className="w-56 sm:w-64 h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-neutral-800">
          <div className="h-full bg-black dark:bg-white animate-loadingBar" />
        </div>

        <p
          className="font-semibold tracking-wide text-base sm:text-lg text-gray-500 dark:text-gray-400">
          Preparing your store...
        </p>

      </div>
    </div>
  )
}