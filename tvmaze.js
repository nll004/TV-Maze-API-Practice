/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  let resultsArr = [];

  try{
    const searchRes = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`)

    searchRes.data.forEach(element => {
      let obj = {};
        obj.name = element.show.name;
        obj.id = element.show.id;
        obj.summary = element.show.summary;
        obj.image = element.show.image.original;

      if(obj.image === undefined){
        obj.image = 'https://tinyurl.com/tv-missing'
      }
      resultsArr.push(obj);
    });
  }
  catch(err){
    console.log('Problem solved for now');
  }
  return resultsArr;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);

  let ids = shows[0].id;
  getEpisodes(ids);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  $('section').css('display', '').
  $('#episodes-list').empty();

  const eps = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`)
  console.log(eps.data);

  eps.data.forEach(element => {
    let ep = {};
      ep.name = element.name;
      ep.url = element.url;
      $('<li>').text(`${ep.name}`).append($(`<a href="${ep.url}">Learn more here</a>`)).appendTo($('#episodes-list'))
  })
}
