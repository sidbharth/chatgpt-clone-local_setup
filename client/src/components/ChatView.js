import React, { useState, useRef, useEffect, useContext } from 'react'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import ChatMessage from './ChatMessage'
import { ChatContext } from '../context/chatContext'
import Thinking from './Thinking'

/**
 * A chat view component that displays a list of messages and a form for sending new messages.
 */
const options = ['ChatGPT', 'DALL·E']
const synth = window.speechSynthesis;

const ChatView = () => {
  const {
    transcript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const messagesEndRef = useRef()
  const inputRef = useRef()
  
  const [formValue, setFormValue] = useState('')
  const [thinking, setThinking] = useState(false)
  const [isVoice, setIsVoice] = useState(false)
  const [selected, setSelected] = useState(options[0])
  const [messages, addMessage] = useContext(ChatContext)
  
  /**
   * Scrolls the chat area to the bottom.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  /**
   * Adds a new message to the chat.
   *
   * @param {string} newValue - The text of the new message.
   * @param {boolean} [ai=false] - Whether the message was sent by an AI or the user.
   */
  const updateMessage = (newValue, ai = false, selected) => {
    const id = Date.now() + Math.floor(Math.random() * 1000000)

    if (ai) {
      const utterThis = new SpeechSynthesisUtterance(newValue);
      synth.speak(utterThis);
    }

    const newMsg = {
      id: id,
      createdAt: Date.now(),
      text: newValue,
      ai: ai,
      selected: `${selected}`
    }

    addMessage(newMsg)
  }

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const newMsg = formValue
    return sendMessage(newMsg)
  }
  /**
   * Sends our prompt to our API and get response to our request from openai.
   *
   * @param {string} prompt - The text to send
   */
  const sendMessage = async (prompt) => {

    const aiModel = selected

    const BASE_URL = process.env.REACT_APP_BASE_URL
    const PATH = aiModel === options[0] ? 'davinci' : 'dalle'
    const POST_URL = BASE_URL + PATH

    setThinking(true)
    setFormValue('')
    updateMessage(prompt, false, aiModel)

    const response = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
      })
    })

    const data = await response.json()

    console.log(response.status)
    if (response.ok) {
      // The request was successful
      data.bot && updateMessage(data.bot, true, aiModel)
    } else if (response.status === 429) {
      setThinking(false)
    } else {
      // The request failed
      window.alert(`openAI is returning an error: ${response.status + response.statusText} 
      please try again later`)
      console.log(`Request failed with status code ${response.status}`)
      setThinking(false)
    }

    setThinking(false)
  }

  /**
   * Scrolls the chat area to the bottom when the messages array is updated.
   */
  useEffect(() => {
    scrollToBottom()
  }, [messages, thinking])

  /**
   * Focuses the TextArea input to when the component is first rendered.
   */
  useEffect(() => {
    inputRef.current.focus()
  }, [])

  /**
   * Generates transcript when user is saying something
   */
  useEffect(() => {
    if (listening === false) {
      if (transcript) {
        sendMessage(transcript)
      }
    }
  }, [listening])

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="chatview">
      <main className='chatview__chatarea'>
      

        {messages.map((message, index) => (
          <ChatMessage key={index} message={{ ...message }} />
        ))}

        {thinking && <Thinking />}

        <span ref={messagesEndRef}></span>
      </main>
      <form className='form' onSubmit={handleFormSubmit}>
        <select value={selected} onChange={(e) => setSelected(e.target.value)} className="dropdown" >
          <option label="Text Therapy">{options[0]}</option>
          <option label="Art Therapy">{options[1]}</option>
        </select>
        <textarea ref={inputRef} className='chatview__textarea-message' value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className='chatview__btn-send' disabled={!formValue}>Send</button>
        <div className='chatview__btn-send' onClick={() => {
          SpeechRecognition.startListening()
        }}>Mic</div>
      </form>
    </div>
  )
}

export default ChatView