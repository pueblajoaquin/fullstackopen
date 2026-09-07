```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Con el contenido de la nota en el body
    server-->>browser: 201 Created
    deactivate server
```