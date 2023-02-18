import React, { createContext, useContext } from "react";

const State = () => {
  // modal
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalTitle, setModalTitle] = React.useState("Modal title");
  const [modalContent, setModalContent] = React.useState("Modal content");
  // modal controller
  const modalController = ({ title, content, isModalClose }) => {
    // set modal title
    if (title) {
      setModalTitle(title);
    }
    // set modal content
    if (content) {
      setModalContent(content);
    }
    // set modal open
    setModalOpen(!isModalClose ? true : false);
  };

  return {
    isModalOpen,
    modalTitle,
    modalContent,
    modalController,
  };
};

const Context = createContext({});

export const ContextProvider = ({ children }) => {
  return <Context.Provider value={State()}>{children}</Context.Provider>;
};

export const useStateContext = () => useContext(Context);
