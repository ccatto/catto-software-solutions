import NextTopLoader from 'nextjs-toploader';

const TopLoader = () => {
  return (
    <>
      <NextTopLoader
        color="#FFA500"
        // color="#2299DD"  // default classic blue
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={true}
        easing="ease"
        speed={200}
        shadow="0 0 10px #FF5F1F,0 0 5px #FF5F1F"
        // shadow="0 0 10px #2299DD,0 0 5px #2299DD"
      />
    </>
  );
};
export default TopLoader;
