// app/components/AtomicDesign/molecules/JumbotronCattoFlexible.tsx
'use client';

type Props = {
  title: string;
  description: string;
};

const JumbotronFlexibleCatto = ({ title, description }: Props) => {
  return (
    <section className="m-2 rounded-3xl bg-gray-700 bg-center bg-no-repeat bg-blend-multiply">
      <div className="mb-2 rounded-2xl border border-gray-800 bg-gray-50 p-8 dark:border-gray-500 dark:bg-gray-800">
        <h1 className="mb-2 text-3xl font-extrabold text-gray-900 md:text-5xl dark:text-slate-50">
          {title}
        </h1>
        <p className="mb-6 text-lg font-normal text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </section>
  );
};

export default JumbotronFlexibleCatto;
