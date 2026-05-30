interface IHeader2Props {
  text: string;
  style?: 'default' | 'light' | 'dark' | 'fancy';
}

const Header2Catto = ({ text, style = 'default' }: IHeader2Props) => {
  const styleMap = {
    default: 'pl-4 text-2xl font-semibold text-gray-900 dark:text-gray-100',
    light: 'pl-4 text-2xl font-semibold text-gray-600 dark:text-gray-400',
    dark: 'pl-4  text-2xl font-semibold text-gray-100',
    fancy:
      'text-2xl font-semibold dark:text-slate-300 text-slate-500 dark:text-slate-50 bg-linear-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 py-3 px-6 rounded-lg shadow-lg text-center hover:from-gray-100 hover:to-gray-400 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:scale-105 transition-transform duration-300',
  };

  return <h2 className={`${styleMap[style]}`}>{text}</h2>;
};

export default Header2Catto;
