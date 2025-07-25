
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import ReactPaginate from "react-paginate";
import { createPortal } from "react-dom";
import css from "./App.module.css";

import { fetchNotes } from "../../services/noteService";
import type { Note } from "../../types/note";

import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [debouncedSearch] = useDebounce(search, 300);

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    keepPreviousData: true,
  });

  const notes = data?.results || [];
  const totalPages = data?.totalPages || 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination pageCount={totalPages} onPageChange={setPage} currentPage={page} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {notes.length > 0 && <NoteList notes={notes} />}
      {isModalOpen &&
        createPortal(
          <Modal onClose={closeModal}>
            <NoteForm onClose={closeModal} />
          </Modal>,
          document.body
        )}

      {isLoading && <p className={css.message}>Loading...</p>}
      {isError && <p className={css.message}>Something went wrong</p>}
    </div>
  );
}
