import "./NotePageRoot.scss";
import Header from "./Header";
import NoteColumnsScrollingContainer from "./NoteColumnsScrollingContainer";

function NotePageRoot() {
  return (
    <main className="NotePageRoot">
      <Header />
      <NoteColumnsScrollingContainer />
    </main>
  );
}

export default NotePageRoot;
