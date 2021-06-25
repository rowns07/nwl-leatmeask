import React, { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Useroom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import '../styles/room.scss';

// type FirebaseQuestions = Record<string, {
//   author: {
//     name: string;
//     avatar: string;
//   },
//   content: string;
//   isHighlighted: boolean
//   isAnswered: boolean;
// }>;

// type QuestionType = {
//   id: string;
//   author: {
//     name: string;
//     avatar: string;
//   },
//   content: string;
//   isHighlighted: boolean
//   isAnswered: boolean;
// }

type RoomParams = {
  id: string;
}

export function Room() {
  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, SetNewQuestion] = useState('');
  // const [questions, setQuestions] = useState<QuestionType[]>([])
  // const [title, setTitle] = useState('');

  const roomId = params.id;
  const { questions, title } = Useroom(roomId);

  // useEffect(() => {
  //   const roomRef = database.ref(`rooms/${roomId}`);

  //   roomRef.on('value', room => {
  //     const databaseRoom = room.val();
  //     // console.log(databaseRoom);
  //     const firebaseQuestion: FirebaseQuestions = databaseRoom.question ?? {};

  //     const parsedQuestions = Object.entries(firebaseQuestion).map(([key, value]) => {
  //       return {
  //         id: key,
  //         content: value.content,
  //         author: value.author,
  //         isHighlighted: value.isHighlighted,
  //         isAnswered: value.isAnswered,
  //       }
  //     })
  //     setTitle(databaseRoom.title);
  //     setQuestions(parsedQuestions)
  //   })
  // }, [roomId]);

  async function handleSendQuestion(e: FormEvent) {
    e.preventDefault()
    if (newQuestion.trim() === '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in');
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    };

    await database.ref(`rooms/${roomId}/question`).push(question)

    SetNewQuestion('')
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode code={roomId} />
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}

        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder="O que voce quer perguntar ?"
            onChange={(e) => SetNewQuestion(e.target.value)}
            value={newQuestion}
          />
          <div className="form-footer">
            {user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>
                Para enviar uma pergunta <button>faça seu login</button>
              </span>

            )}
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
          </div>
        </form>
        <div className="question-list">

          {questions.map(question =>

            <Question
              key={question.id}
              content={question.content}
              author={question.author}
            />)
          }
        </div>
        {/* {JSON.stringify(questions)} */}
      </main>
    </div>
  )
}