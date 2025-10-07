(() => {
  /**
   * @import {dispatch, select} from '@wordpress/data'
   * @import {parse, serialize} from '@wordpress/blocks'
   */

  // @ts-ignore
  const { select, dispatch } = wp.data
  // @ts-ignore
  const { parse, serialize } = wp.blocks
  const TAG_NAMES = ['P', 'A', 'BUTTON', 'UL', 'OL', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'TABLE', 'LEGEND', 'LABEL', 'ADDRESS', 'FORM', 'PRE']

  /**
   * Collects all text from target elements
   * @param {Element} element - The element to traverse for text nodes
   * @param {string[]} tagNames - Array of tag names to extract text from
   * @returns {string[]} An array of non-empty text content strings from text nodes
   */
  function collectText(element, tagNames) {
    const content = []
    const stack = [element]

    while (stack.length > 0) {
      const current = stack.pop()

      // check if current node is a TextNode and not empty
      if (tagNames.includes(current.tagName)) {
        const innerHTMl = current.innerHTML

        if (innerHTMl.trim()) {
          content.push(current.innerHTML)
        }
      } else if (
        current instanceof HTMLImageElement
        && current.alt
        && current.alt.trim()
      ) {
        content.push(current.alt)
      } else if (
        current.ariaLabel
        && current.ariaLabel.trim()
      ) {
        content.push(current.ariaLabel)
      } else {
        // add all children to stack for traversal
        if (current.children) {
          for (let i = current.children.length - 1; i >= 0; i--) {
            stack.push(current.children[i])
          }
        }
      }
    }

    return content
  }

  /**
   * Displays a message in the designated message element with the specified type.
   *
   * @param {string} message - The message text to display
   * @param {string} [type='success'] - The type of message (e.g., 'success', 'error', 'warning')
   * @param {number} [timeout=5000] - The notice timeout length
   */
  function displayMessage(message, type = 'success', timeout = 5000) {
    const boxElement = document.querySelector('#deepl_translate_box .inside')
    const displayMessageElement = document.createElement('div')

    boxElement.insertBefore(displayMessageElement, boxElement.firstChild)
    displayMessageElement.setAttribute('class', 'notice notice-' + type)
    displayMessageElement.textContent = message


    setTimeout(() => {
      displayMessageElement.remove()
    }, timeout)
  }

  /**
   * Toggles the state of a translate button between enabled and disabled states.
   *
   * @param {HTMLButtonElement} btn - The button element to toggle
   */
  function toggleTranslateButton(btn) {
    if (!btn.disabled) {
      btn.disabled = true
      btn.textContent = 'Translating...'
    } else {
      btn.disabled = false
      btn.textContent = 'Translate!'
    }
  }

  const translateButton = document.getElementById('deepl-translate-button')

  if (translateButton instanceof HTMLButtonElement) {
    translateButton.addEventListener('click', async () => {
      const editor = select('core/editor')

      if (!editor || !editor.getEditedPostAttribute) {
        return
      }

      // disable translate button
      toggleTranslateButton(translateButton)

      // get the current post content from the editor
      const currentContent = editor.getEditedPostAttribute('content')
      const contentContainer = document.createElement('div')

      contentContainer.innerHTML = currentContent

      // extract all text nodes from the content
      const text = collectText(contentContainer, TAG_NAMES)
      const selectLanguage = document.getElementById('deepl-translate-languages')

      // send the text to the translation API
      const response = await fetch('/?rest_route=/deepl-translation/v1/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text,
          // @ts-ignore
          target_lang: selectLanguage.value
        })
      })

      if (response.ok) {
        try {
          const data = await response.json()

          if (data.status !== 'success') {
            // reset translate button
            toggleTranslateButton(translateButton)

            return displayMessage(data.message, 'error')
          }

          // initialize variables for reconstructing the translated content
          let result = ''
          let originalContent = currentContent

          // process each translation and reconstruct the content
          for (let i = 0; i < data.translations.length; i++) {
            const { translation, original_text } = data.translations[i]
            const indexOf = originalContent.indexOf(original_text)

            // add the portion of content before the translation
            result += originalContent.slice(0, indexOf) + translation

            // update the remaining content to process
            originalContent = originalContent.slice(indexOf + original_text.length)
          }

          // add any remaining content that wasn't translated
          if (originalContent.length) {
            result += originalContent
          }

          // parse the translated content into blocks
          const blocks = parse(result)
          const content = serialize(blocks)

          // update the editor with the translated content
          dispatch('core/editor').editPost({ content })

          displayMessage('Translation successful!')

          // reset translate button
          toggleTranslateButton(translateButton)
        } catch (error) {
          displayMessage('error', error.message)

          // reset translate button
          toggleTranslateButton(translateButton)
        }
      } else {
        displayMessage('An error occurred', 'error')

        // reset translate button
        toggleTranslateButton(translateButton)
      }
    })
  }
})()
