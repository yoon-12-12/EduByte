import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/common/Button";

interface Note {
  id: number;
  title: string;
  content: string;
}

export default function ExamNotes() {
  const { id } = useParams();

  const storageKey = `notes_${id}`;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);

    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [storageKey]);

  const saveNotes = (updatedNotes: Note[]) => {
    setNotes(updatedNotes);

    localStorage.setItem(
      storageKey,
      JSON.stringify(updatedNotes)
    );
  };

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
    };

    const updatedNotes = [
      newNote,
      ...notes,
    ];

    saveNotes(updatedNotes);

    setTitle("");
    setContent("");
  };

  const handleDeleteNote = (
    noteId: number
  ) => {
    const updatedNotes =
      notes.filter(
        (note) => note.id !== noteId
      );

    saveNotes(updatedNotes);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="학습 노트"
          description={`시험 ID: ${id}`}
        />

        {/* 노트 작성 */}
        <div
          className="
            bg-white
            dark:bg-slate-900

            border
            border-slate-200
            dark:border-slate-700

            p-6
            rounded-xl
            shadow-sm

            space-y-4

            transition-colors
            duration-300
          "
        >
          <input
            type="text"
            placeholder="노트 제목"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="
              w-full

              bg-white
              dark:bg-slate-800

              text-slate-900
              dark:text-slate-100

              border
              border-slate-300
              dark:border-slate-700

              rounded-lg
              p-3

              placeholder:text-slate-400
              dark:placeholder:text-slate-500

              transition-colors
            "
          />

          <textarea
            placeholder="학습 내용을 작성하세요."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            rows={6}
            className="
              w-full

              bg-white
              dark:bg-slate-800

              text-slate-900
              dark:text-slate-100

              border
              border-slate-300
              dark:border-slate-700

              rounded-lg
              p-3

              placeholder:text-slate-400
              dark:placeholder:text-slate-500

              transition-colors
            "
          />

          <Button onClick={handleAddNote}>
            노트 저장
          </Button>
        </div>

        {/* 노트 목록 */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div
              className="
                bg-white
                dark:bg-slate-900

                text-slate-600
                dark:text-slate-300

                border
                border-slate-200
                dark:border-slate-700

                p-6
                rounded-xl
                shadow-sm

                transition-colors
              "
            >
              저장된 노트가 없습니다.
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="
                  bg-white
                  dark:bg-slate-900

                  border
                  border-slate-200
                  dark:border-slate-700

                  p-6
                  rounded-xl
                  shadow-sm

                  transition-colors
                  duration-300
                "
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h2
                      className="
                        text-xl
                        font-semibold

                        text-slate-900
                        dark:text-slate-100
                      "
                    >
                      {note.title}
                    </h2>

                    <p
                      className="
                        mt-3
                        whitespace-pre-wrap

                        text-slate-700
                        dark:text-slate-300
                      "
                    >
                      {note.content}
                    </p>
                  </div>

                  <Button
                    onClick={() =>
                      handleDeleteNote(
                        note.id
                      )
                    }
                    className="
                      bg-red-600
                      hover:bg-red-700
                    "
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}