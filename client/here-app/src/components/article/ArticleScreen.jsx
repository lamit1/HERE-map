import React, { useEffect, useState } from "react";
import Header from "../../layout/Header";
import Container from "../../layout/Container";
import { useArticle } from "../../hooks/useArticles";
import Article from "./Article";
import useURLParams from "../../hooks/useURLParams";
import { Warning } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

const ArticleScreen = () => {
  const { path, params } = useURLParams();
  const [stateName, setStateName] = useState("");

  const { article, loading } = useArticle(stateName);

  useEffect(() => {
    const domain = path.split("/")[1];
    if (domain === "article") {
      const stateName = path.split("/")[2];
      if(stateName)
        setStateName(stateName);
    }
  }, [path]);


  if (loading)
    return (
      <div className="flex w-screen h-screen flex-col bg-bg text-text">
        <Header />
        <div className="flex flex-auto items-center justify-center">
          <CircularProgress />
        </div>
      </div>
    );

  if (!article)
    return (
      <div className="flex w-screen h-screen flex-col bg-bg text-text">
        <Header />
        <h1 className="flex flex-auto gap-2 text-red items-center justify-center font-serif font-bold">
          <Warning sx={{ width: "3rem", height: "3rem" }} />
          Article not found!
        </h1>
      </div>
    );

  return (
    <div className="bg-bg text-text">
      <Header />
      <Container>
        <Article article={article} />
      </Container>
    </div>
  );
};

export default ArticleScreen;
