import React from 'react'
import {useEditor, EditorContent} from '@tiptap/react'
import {CheckIcon} from '@heroicons/react/solid'
import {RadioGroup} from '@headlessui/react'
import {useField} from 'formik'
import Typography from '@tiptap/extension-typography'
import Highlight from '@tiptap/extension-highlight'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import cx from 'classnames'
import {getEmoji} from '@skillrecordings/skill-api/dist/client'

export const FeedbackField: React.FC<React.PropsWithChildren<any>> = ({
  label = 'Your feedback',
  errors,
  touched,
  isSubmitted,
  showMarkdown = true,
}) => {
  const [field] = useField({name: 'text'})
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Link],
    content: field.value,
    onUpdate: ({editor}) => {
      field.onChange({target: {value: editor.getHTML(), name: 'text'}})
    },
    onBlur: ({event}) => {
      field.onBlur(event)
    },
    editorProps: {
      attributes: {
        id: 'text',
        name: 'text',
        class:
          'prose min-h-[150px] max-h-[250px] overflow-y-auto shadow-md shadow-black/50 bg-gray-800 p-3 focus:ring-cyan-300 block w-full border border-gray-700 rounded-md',
      },
    },
  })
  const isEmpty = editor?.isEmpty

  React.useEffect(() => {
    if (isEmpty) {
      field.onChange({target: {value: '', name: 'text'}})
    }
    if (isSubmitted) {
      editor?.commands?.clearContent()
    }
  }, [isEmpty, isSubmitted])

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <label
          className="inline-block flex-shrink-0 pb-1 font-semibold"
          htmlFor="text"
        >
          {label} <span className="font-normal text-gray-300">(required)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="inline-block pb-1 text-xs font-medium leading-tight text-pink-300 sm:text-sm"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md ring ring-pink-300 ring-opacity-80 ring-offset-gray-900':
            errors.text && touched.text,
        })}
      >
        <EditorContent editor={editor} name="text" id="text" />
      </div>
      {showMarkdown && (
        <small className="block pt-2 text-sm text-gray-400">
          Styling with markdown is supported.
        </small>
      )}
    </div>
  )
}

export const EmotionField: React.FC<React.PropsWithChildren<any>> = (props) => {
  const [field] = useField({name: props.name})
  return (
    <div>
      <label
        className="inline-flex pb-1 font-semibold"
        htmlFor="context.emotion"
      >
        Emotion
      </label>
      <RadioGroup
        {...props}
        value={field.value}
        onChange={(value: string) => {
          field.onChange({target: {value, name: props.name}})
        }}
      >
        <RadioGroup.Label className="sr-only">Pick an emotion</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {[':heart_eyes:', ':wave:', ':sob:'].map((emotion) => (
            <RadioGroup.Option
              key={emotion}
              value={emotion}
              className={({active, checked}) =>
                `${
                  active
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-900'
                    : ''
                }
              ${
                checked
                  ? 'bg-gray-600 bg-opacity-75 text-white shadow-inner hover:bg-gray-600'
                  : 'bg-gray-800 hover:bg-gray-700/80'
              }
                relative flex cursor-pointer rounded-lg border border-gray-700 px-4 py-3 transition focus:outline-none`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label
                    className={`cursor-pointer text-xl font-medium ${
                      checked ? 'text-gray-300' : 'text-gray-300'
                    }`}
                    role="img"
                    aria-label={getEmoji(emotion).label}
                  >
                    {getEmoji(emotion).image}
                  </RadioGroup.Label>
                  {checked && (
                    <CheckIcon className="absolute bottom-1 right-1 h-4 w-4 text-gray-100" />
                  )}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export const CategoryField: React.FC<
  React.PropsWithChildren<{
    name: string
    categories?: string[]
    id: string
  }>
> = ({name, categories = ['general', 'help', 'code'], id}, ...rest) => {
  const [field] = useField({name})
  return (
    <div>
      <label
        className="inline-flex pb-1 font-semibold"
        htmlFor="context.emotion"
      >
        Category
      </label>
      <RadioGroup
        {...rest}
        name={name}
        id={id}
        value={field.value}
        onChange={(value: string) => {
          field.onChange({target: {value, name: name}})
        }}
      >
        <RadioGroup.Label className="sr-only">Pick a category</RadioGroup.Label>
        <div className="flex items-center space-x-3">
          {categories.map((category) => (
            <RadioGroup.Option
              key={category}
              value={category}
              className={({active, checked}) =>
                `${
                  active
                    ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-gray-900'
                    : ''
                }
              ${
                checked
                  ? 'bg-gray-600 bg-opacity-75 text-white shadow-inner hover:bg-gray-600'
                  : 'bg-gray-800 hover:bg-gray-700/80'
              }
              relative flex cursor-pointer rounded-lg border border-gray-700 px-4 py-3.5 transition focus:outline-none`
              }
            >
              {({checked}) => (
                <>
                  <RadioGroup.Label
                    className={`cursor-pointer font-medium ${
                      checked ? 'text-gray-100' : 'text-gray-100'
                    }`}
                  >
                    {category}
                  </RadioGroup.Label>
                  {checked && (
                    <CheckIcon className="absolute bottom-1 right-1 h-4 w-4 text-gray-100" />
                  )}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
}

export const OptionalTextField: React.FC<React.PropsWithChildren<any>> = ({
  label = 'Additional Information',
  errors,
  touched,
  isSubmitted,
}) => {
  const [field] = useField({name: 'text'})
  const editor = useEditor({
    extensions: [StarterKit, Highlight, Typography, Link],
    content: field.value,
    onUpdate: ({editor}) => {
      field.onChange({target: {value: editor.getHTML(), name: 'text'}})
    },
    onBlur: ({event}) => {
      field.onBlur(event)
    },
    editorProps: {
      attributes: {
        id: 'text',
        name: 'text',
        class:
          'prose min-h-[150px] max-h-[250px] overflow-y-auto bg-input p-3 focus:ring-ring block w-full border border-border rounded-md dark:text-white',
      },
    },
  })
  const isEmpty = editor?.isEmpty

  React.useEffect(() => {
    if (isEmpty) {
      field.onChange({target: {value: '', name: 'text'}})
    }
    if (isSubmitted) {
      editor?.commands?.clearContent()
    }
  }, [isEmpty, isSubmitted])

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <label
          className="inline-block flex-shrink-0 pb-1 font-semibold"
          htmlFor="text"
        >
          {label} <span className="font-normal opacity-50">(optional)</span>
        </label>
        {errors.text && touched.text ? (
          <div
            aria-live="polite"
            className="text-text inline-block pb-1 text-xs font-medium leading-tight opacity-50 sm:text-sm"
          >
            {errors.text}
          </div>
        ) : null}
      </div>
      <div
        className={cx({
          'rounded-md ring ring-pink-300 ring-opacity-80 ring-offset-background':
            errors.text && touched.text,
        })}
      >
        <EditorContent editor={editor} name="text" id="text" />
      </div>
    </div>
  )
}

export const SeatSelectionField: React.FC<React.PropsWithChildren<any>> = (
  props,
) => {
  const [field, meta, helpers] = useField({name: 'numberOfSeats'})

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(5, parseInt(event.target.value, 10) || 5)
    if (value !== field.value) {
      helpers.setValue(value)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="numberOfSeats" className="inline-flex font-semibold">
        Number of Seats{' '}
        <span className="ml-2 font-normal text-gray-500">(required)</span>
      </label>
      <input
        {...field}
        {...props}
        type="number"
        min="5"
        onChange={handleChange}
        value={field.value || 5}
        className="w-full rounded-md border border-gray-200 bg-gray-100 p-3 text-foreground shadow focus:ring-sky-500 dark:border-gray-700 dark:bg-gray-900"
      />
      {meta.touched && meta.error ? (
        <div className="text-xs font-medium text-pink-500 sm:text-sm">
          {meta.error}
        </div>
      ) : null}
    </div>
  )
}
