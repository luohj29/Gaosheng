import { getTranslations } from 'next-intl/server';

type Props = {
  locale: string;
};

export default async function ProjectShow({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'HomePage' });

  const projectKeys: Array<
    | 'project1'
    | 'project2'
    | 'project3'
    | 'project4'
    | 'project5'
    | 'project6'
    | 'project7'
    | 'project8'
  > = [
    'project1',
    'project2',
    'project3',
    'project4',
    'project5',
    'project6',
    'project7',
    'project8',
  ];

  return (
    <section id="project-show" className="space-y-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
          {t('projectShowHeading')}
        </p>
        <p className="text-gray-600">{t('projectShowDescription')}</p>
      </div>

      {/* 项目宫格 —— 无间隙 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {projectKeys.map((key) => (
          <figure
            key={key}
            className="w-full h-full overflow-hidden"
          >
            <div className="w-full h-full">
              <img
                src={`/images/${key}.webp`}
                alt={key}
                className="w-full h-full object-cover"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
