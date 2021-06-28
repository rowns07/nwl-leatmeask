import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { Useroom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import '../styles/room.scss';


type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  // const [newQuestion, SetNewQuestion] = useState('');

  const roomId = params.id;
  const { questions, title } = Useroom(roomId);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    })

    history.push('/');
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/question/${questionId}/`).update({
      isAnswered: true,
    });
  }

  async function handleHighLightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/question/${questionId}/`).update({
      isHighlighted: true,
    });
  }

  async function handleDeleteQuestion(questionId: string) {
    console.log(questionId);
    const deleteQuestion = window.confirm('Deseja apagar a questão?')
    if (deleteQuestion) {
      await database.ref(`rooms/${roomId}/question/${questionId}/`).remove();
    }

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button
              isOutlined
              onClick={handleEndRoom}
            >
              Encerrar sala
              </Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} perguntas</span>}

        </div>

        <div className="question-list">

          {questions.map(question => {
            return (

              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => { handleCheckQuestionAsAnswered(question.id) }}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>

                    <button
                      type="button"
                      onClick={() => { handleHighLightQuestion(question.id) }}
                    >
                      <img src={answerImg} alt="Dar destaque a pergunta" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => { handleDeleteQuestion(question.id) }}
                >
                  <img src={deleteImg} alt="Deletar questão" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
    </div>
  )
}