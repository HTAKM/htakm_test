import notesData from 'https://htakm.github.io/latex-notes/js/notesData.js';
import latexClasses from 'https://htakm.github.io/latex-notes/js/latexTemplateClass.js';

const notesTable = document.getElementById("notes-table");
const classContainer = document.getElementById("notes-class-list");

// Function to create note tables
function createNoteTable() {
    const header = document.createElement("thead");
    header.innerHTML = `
        <tr>
            <th scope="col">Title</th>
            <th scope="col">LaTeX Class used</th>
            <th scope="col">PDF file</th>
            <th scope="col">TEX file</th>
            <th scope="col">Other files</th>
        </tr>`;
    const tableBody = document.createElement("tbody");
    notesData.forEach(note => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <th scope="row">${note.title}</th>
            <td>${note.class}</td>
            <td>${note.pdfLink ? `<a href="${note.pdfLink}" target="_blank"
                                     aria-label="Download ${note.title} PDF">PDF</a>` : 
                ''}
            </td>
            <td>${note.texLink ? `<a href="${note.texLink}" target="_blank"
                                     aria-label="Download ${note.title} TeX">TeX</a>` : ''}</td>
            <td>${note.others ? `<a href="${note.others.link}" target="_blank"
                                    aria-label="Download ${note.title} ${note.others.name}">${note.others.name}</a>` : ''}</td>
        `;
        tableBody.appendChild(row);
    });
    notesTable.appendChild(header);
    notesTable.appendChild(tableBody);
}

// Function to create class links
function createClassLink() {
    latexClasses.forEach(latexClass => {
        const listItem = document.createElement("li");
        listItem.className = "list-group-item d-flex justify-content-between align-items-center";
        listItem.innerHTML = `
            <a href="${latexClass.link}" target="_blank" 
               aria-label="Download ${latexClass.name} class">${latexClass.name}</a>
            ${latexClass.sidenote ? `<span class="link-item">(${latexClass.sidenote})</span>` : ''}
        `;
        classContainer.appendChild(listItem);
    });
}

createNoteTable();
createClassLink();
