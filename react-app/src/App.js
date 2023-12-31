import React, { useEffect, useState } from "react";
import "./App.css";
import SearchResult from "./components/SearchResult/SearchResult";

function App() {
	const [query, setQuery] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);
	const [isDarkMode, setIsDarkMode] = useState(
		window.matchMedia("(prefers-color-scheme: dark)").matches
	);

	useEffect(() => {
		if (isDarkMode) {
			document.body.classList.add("dark-mode");
		} else {
			document.body.classList.remove("dark-mode");
		}
	}, [isDarkMode]);

	const handleSearch = async () => {
		try {
			const response = await fetch(
				`/links/?query=${encodeURIComponent(query.toLowerCase())}`
			);
			const data = await response.json();
			setSearchResults(data);
			setHasSearched(true);
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleThemeChange = () => {
		setIsDarkMode(!isDarkMode);
	};

	return (
		<div className="App">
			<h1>Qooqle</h1>
			<input
				type="text"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder="Whatcha lookin' for?"
			/>
			<button onClick={handleSearch}>Search</button>
			<button onClick={handleThemeChange}>Change Theme</button>
			{hasSearched && (
				<div className="search-results">
					{searchResults.length > 0 ? (
						searchResults.map((result, index) => (
							<SearchResult
								key={index}
								title={result.title}
								paragraph={result.paragraph}
								url={result.url}
								score={result.score}
								pageRank={result.pageRank}
								result={index + 1}
							/>
						))
					) : (
						<p className="error-message">{searchResults.message}</p>
					)}
				</div>
			)}
		</div>
	);
}

export default App;
