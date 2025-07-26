import axios from "axios";
import type { Note, NewNote } from "../types/note";

const myKey = import.meta.env.VITE_NOTEHUB_TOKEN;
console.log("TOKEN:", myKey);

axios.defaults.baseURL = "https://notehub-public.goit.study/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${myKey}`;

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  search = "",
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>("/notes", {
    params: {
      ...(search !== "" ? { search } : {}),
      page,
      perPage,
    },
  });
  return response.data;
};

export const createNote = async (noteData: NewNote): Promise<Note> => {
  const response = await axios.post<Note>("/notes", noteData);
  return response.data;
};

export const deleteNote = async (noteId: number): Promise<Note> => {
  const response = await axios.delete<Note>(`/notes/${noteId}`);
  return response.data;
};




