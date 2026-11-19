// src/utils/works.ts
// Ordine dei lavori: anno decrescente; a parità di anno il più recente prima
// (campo opzionale `date`, formato YYYY-MM o YYYY-MM-DD); chi non ha `date`
// resta dopo quelli datati, in ordine alfabetico. Usato da Nav e da /works/:
// i due elenchi devono restare identici, quindi il comparatore vive qui e non
// in due copie.

type SortableWork = {
  data: { year: number; date?: string; project: string };
};

export function sortWorks<T extends SortableWork>(works: T[]): T[] {
  return [...works].sort((a, b) => {
    if (b.data.year !== a.data.year) {
      return b.data.year - a.data.year;
    }

    const dateA = a.data.date ?? '';
    const dateB = b.data.date ?? '';
    if (dateA !== dateB) {
      if (!dateA) return 1;
      if (!dateB) return -1;
      return dateB.localeCompare(dateA);
    }

    return a.data.project.localeCompare(b.data.project);
  });
}
