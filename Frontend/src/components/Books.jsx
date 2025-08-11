import { useState } from "react";
import useFetch from "../useFetch";

const Books = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const { data, loading, error } = useFetch(
    "https://bi-1-3-hw-1-pi.vercel.app/books"
  );

  const handleDelete = async (bookId) => {
    try {
      const response = await fetch(
        `https://bi-1-3-hw-1-pi.vercel.app/books/${bookId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      const data = await response.json();
      if (data) {
        setSuccessMessage("Book Deleted Successfully.");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {data?.error && <p>Error: {error.message}</p>}
      {data && data.length > 0 ? (
        <ul>
          {data.map((book) => (
            <li key={book._id}>
              <h3>{book.title}</h3>
              <p>
                <strong>Author:</strong> {book.author}
              </p>
              <p>
                <strong>Published:</strong> {book.publishedYear}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>
                <strong>Language:</strong> {book.language}
              </p>
              <p>
                <strong>Country:</strong> {book.country}
              </p>
              <p>
                <strong>Rating:</strong> {book.rating}
              </p>
              <p>
                <strong>Summary:</strong> {book.summary}
              </p>
              <img src={book.coverImageUrl} alt={book.title} width="100" />
              <p>
                <button
                  onClick={() => {
                    handleDelete(book._id);
                  }}
                >
                  Delete
                </button>
              </p>
              <p>{successMessage}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No books found.</p>
      )}
    </div>
  );
};
export default Books;
