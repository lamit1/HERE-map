import { useEffect, useState } from "react";
import { fetchArticles } from "../graphql/api/search";

export const useArticle = (stateName = "") => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if(!stateName) return;
      try {
        setLoading(true);
        const res = await fetchArticles(stateName);
        setArticle(res.data.article);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        alert(error);
      }
    };
    fetchData();
  }, [stateName]);

  return { article, loading };
};
