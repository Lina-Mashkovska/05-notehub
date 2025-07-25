import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import { createPortal } from "react-dom";
import css from "./App.module.css";
import { fetchNotes } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService"; 
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
  } = useQuery<FetchNotesResponse>({ 
    queryKey: ["notes", page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes || [];
  const totalPages = data?.totalPages || 0;

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const queryClient = useQueryClient();

const handleDelete = async (id: string) => {
  try {
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ["notes"] });
  } catch (error) {
    console.error("Failed to delete note", error);
  }
};
console.log("App data:", data);
console.log("notes:", notes);
console.log("totalPages:", totalPages);


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={setSearch} />
        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            onPageChange={setPage}
            currentPage={page}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {/* {notes.length > 0 && <NoteList notes={notes} />} */}
      <NoteList notes={notes} onDelete={handleDelete} />
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

