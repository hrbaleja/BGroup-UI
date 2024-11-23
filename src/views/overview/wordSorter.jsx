import React, { useState } from "react";

const WordSorter = () => {
  const [wordList, setWordList] = useState([]);
  const [sortedWords, setSortedWords] = useState("");

  // Function to handle sorting
  const sortWords = () => {
    const sorted = [...wordList].sort((a, b) => {
      if (a.length === b.length) {
        return a.localeCompare(b); // Sort alphabetically if lengths are equal
      }
      return a.length - b.length; // Sort by length
    });
    setSortedWords(sorted.join(", "));
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const input = e.target.value;
    const words = input.split(",").map((word) => word.trim());
    setWordList(words);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Word Sorter</h2>
      <textarea
        placeholder="Enter words separated by commas"
        rows={5}
        cols={40}
        onChange={handleInputChange}
      />
      <br />
      <button type="button" onClick={sortWords} style={{ marginTop: "10px" }}>
        Sort Words
      </button>
      <div style={{ marginTop: "20px" }}>
        <h3>Sorted Words</h3>
        <p>{sortedWords}</p>
      </div>
    </div>
  );
};

export default WordSorter;
