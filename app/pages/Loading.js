const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="relative w-16 h-16">
        <div className="absolute border-4 border-blue-500 border-t-transparent rounded-full w-full h-full animate-spin"></div>
        <div className="absolute inset-0 flex justify-center items-center text-black">
          🌙
        </div>
      </div>
    </div>
  );
};

export default Loading;
