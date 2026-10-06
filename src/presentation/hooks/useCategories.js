import { useState, useEffect } from 'react';
import { GetCategoriesUseCase } from '../../application/usecases/GetCategoriesUseCase';
import { CategoryRepositoryImpl } from '../../data/repositories/CategoryRepositoryImpl';

const getCategoriesUseCase = new GetCategoriesUseCase(new CategoryRepositoryImpl());

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const list = await getCategoriesUseCase.execute();
        if (isMounted) {
          setCategories(list);
          setError(null);
        }
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => { isMounted = false; };
  }, []);

  return { categories, isLoading, error };
}
