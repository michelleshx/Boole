import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ExpandableListItem.module.css";

interface ExpandableListItemProps {
  title: string;
  children: React.ReactNode;
}

const ExpandableListItem = ({ title, children }: ExpandableListItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <li className={styles.container}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.listItem}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronRight} />
        {title}
      </button>
      {isExpanded && <div className={styles.content}>{children}</div>}
    </li>
  );
};

export default ExpandableListItem;
