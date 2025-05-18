import React from "react";
import CuraItem from "./CuraItem";
import VisitaItem from "./VisitaItem";
import SesionItem from "./SesionItem";
import GrupoItem from "./GrupoItem";

const AgendaItem = ({ item, tipo }) => {
  switch (tipo) {
    case "cura":
      return <CuraItem item={item} />;
    case "visita":
      return <VisitaItem item={item} />;
    case "sesion":
      return <SesionItem item={item} />;
    case "grupo":
      return <GrupoItem item={item} />;
    default:
      return null;
  }
};

export default AgendaItem;
