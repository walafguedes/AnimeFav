
export class MyAnime {
  static search(username) {

    const endpoint = `https://api.jikan.moe/v4/anime?q= ${username}/moreinfo`
    

    

    return fetch(endpoint).then(data => data.json())
    .then(data => ({
 
          title: data.data[0].title.toLowerCase(),
          synopsis: data.data[0].synopsis,
          image_url: data.data[0].images.jpg.image_url,
          mal_id: data.data[0].mal_id,
          episodes: data.data[0].episodes,
          year: data.data[0].year,
          status: data.data[0].status,
        }))
  }

}


export class Favorites {

  constructor(root) {
    this.root = document.querySelector(root)
    this.load()


  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@anime-favorites:')) || []
  
  }
   save() {
     localStorage.setItem('@anime-favorites:', JSON.stringify(this.entries))
   }
 

async add(username) {
  
  try {
    const user = await MyAnime.search(username)
    
    const userExists = this.entries.find(entry => entry.title === username)
    
    if (userExists) {
     throw new Error('anime ja inserido')
   }
    
    
    
    if (user.title === undefined) {
      throw new Error('Anime nao encontrado!')
    }
    
    this.entries = [user, ...this.entries]
    this.update()
    this.save()
    
  }
  catch (error) {
    alert(error)
  }


  
}

    


  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.title !== user.title)

    this.entries = filteredEntries


    this.update()
    this.save()
  }





}


export class FavoritesList extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')
    this.update()
    this.onadd()
  }

  onadd() {
    
    const addbutton = this.root.querySelector('.search button')
    addbutton.onclick = () => {
      const {value} = this.root.querySelector('.search #input-search')
      
     this.add(value)
      
     
    }
  }

   FavoriteEmpt() {
     const noFavorite = document.querySelector('footer')
 
     if (this.entries.length < 1) {
       noFavorite.classList.remove('hide')
     } else {
       noFavorite.classList.add('hide')
     }

   }



  update() {
    this.removeAllTr()
     this.FavoriteEmpt()




    this.entries.forEach(user => {

      const row = this.creatRow()

      row.querySelector('.user img').src = `${user.image_url}`
      row.querySelector('.user img').alt = `imagem de ${user.title}`
      row.querySelector('.user p').textContent = (user.title[0].toUpperCase() + user.title.slice(1).toLowerCase())
      row.querySelector('.user a').href = `https://myanimelist.net/anime/${user.mal_id}/${user.title}`
      row.querySelector('.user span').textContent = `${user.episodes} Episodios`
      row.querySelector('.synopsis').textContent = user.synopsis
      row.querySelector('.status').textContent = `${user.status}/${user.day} `

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('tem certeza que dejesa remover ?')
        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })

  }


  creatRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user">
    <img src="https:\/\/cdn.myanimelist.net\/images\/anime\/1120\/120796.jpg" alt="">
    <a href="https:\/\/myanimelist.net\/anime\/47194\/Summertime_Render" target="_blank">
    <p>Sumertime Render</p>
    <span>25 episodios</span>
    </a>
    </td>
    <td class="synopsis">sombra do passado </td>
    <td class="status">sexta-feira</td>
    <td class="remove"><button>remove</button> </td>
    `
    
    return tr


  }



  removeAllTr() {


    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })


  }
}
