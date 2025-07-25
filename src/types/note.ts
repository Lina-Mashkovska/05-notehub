export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}
  
  export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

  export interface NewNote {
    title: string;
    content: string;
    tag: string;
  }