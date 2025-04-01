// CLASS FORM: Make class instances
class MovieData{
    constructor(movie, genre, year){
        this.movie = movie;
        this.genre = genre;
        this.year = year;
    }
}

//CLASS STORE
let data;
class Store{
    static getData(){

        if(localStorage.getItem("data") === null){
            data = []
        } else {
            data = JSON.parse(localStorage.getItem("data"));
        }
        return data;
    }

    static addData(movie){
        const movies = Store.getData()

        data.push(movie);

        localStorage.setItem("data", JSON.stringify(movies))
    }
    
    static deleteData(year) {
        const movies = JSON.parse(localStorage.getItem('movies')) || [];
        const updatedMovies = movies.filter(movie => movie.year !== year);
        localStorage.setItem('data', JSON.stringify(updatedMovies));
    }
}

// CLASS UI: handle UI of form data

class UI {
    static movieData(){
        const movieData = Store.getData()
        movieData.forEach(item => UI.addDataToRow(item));

    }
    
    // Append Child to show Data on UI
    static addDataToRow(item){
        const moviesContainer = document.getElementById('movies-container');

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${item.movie}</td>
            <td>${item.genre}</td>
            <td class="year">${item.year}</td>
            <td>
                <a href="#" class="delete-item data-year=${item.year}">
                    <i class="fa-solid fa-trash"></i>
                </a>
            </td>
        `
        moviesContainer.appendChild(row);
    }

    // SHOW TOAST NOTIFICATIONS

    static showAlerts(message, className, icon, title){
        const notifications = document.querySelector('#notifications')

        const toast = document.createElement('div')
        toast.className = `toast ${className}`;

        toast.innerHTML = 
        `
            <i class="${icon}"></i>
            <div class="content">
                <span class="toast-title">${title}</span>
                <p>${message}</p>
            </div>
            <i class="fa-solid fa-xmark close-btn"></i>
        `
        if(toast){
            notifications.appendChild(toast)
        }

        // SET TIMEOUT FOR NOTIFICATION
        const timeout = setTimeout(() => {
            toast.remove()
        }, 5000)
        
        // CLOSE NOTIFICATION BY CLOSE BUTTON
        document.querySelector('.close-btn').addEventListener('click', ()=> {
            toast.remove();

            // CLEAR TIMEOUT
            clearTimeout(timeout);
        })
    }

    // DELETE ITEMS FROM UI
    static deleteItem(){
        document.addEventListener('click', (e) => {

            // DELETING ENTIRE MOVIE ROW
            const deleteData = e.target.closest('.delete-item')

            // Checking which row's delete button is clicked
            if(deleteData){
                e.preventDefault();
                const row = deleteData.closest('tr')
                const year =  deleteData.dataset.year
                Store.deleteData(year)
                row.remove()
                // Show Alert when item gets delete
                UI.showAlerts("Item removed successfully", "warning", "fa-solid fa-triangle-exclamation", "Attention");

            }
        })
    }

}


// CLASS ADD DATA: handle user data

class AddData {
    static getFormdata(){
        const form = document.getElementById('form')
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // GET USER VALUES
            const movie = document.getElementById("name").value;
            const genre = document.getElementById("genre").value;
            const year = document.getElementById("year").value;

            // INSTANTIATE DATA
            const formData = new MovieData(movie, genre, year);

            // ADD DATA TO THE UI
            if(movie !== "" && genre !== "" && year !== ""){
                // SHOW DATA TO THE UI
                UI.addDataToRow(formData);


                // SET DATA TO THE LOCAL STORAGE
                Store.addData(formData)
            }

            if(movie == "" || genre == "" || year == ""){
                 UI.showAlerts("Please fill in the fields", "alert", "fa-solid fa-circle-exclamation", "Alert")
            } else {
                 UI.showAlerts("Movie successfully added to the list", "success", "fa-solid fa-circle-check", "Success");
            }
            
            form.reset();
        })
    }
}

// Method to submit the form
AddData.getFormdata()

// To delete item from the list
UI.deleteItem()

// SHOW UI ON DOCUMENT LOAD

document.addEventListener('DOMContentLoaded', UI.movieData)





