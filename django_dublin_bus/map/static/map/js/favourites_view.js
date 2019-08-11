function generate_favourites_view(){
    directions_button.classList.remove("active_view");
    favourites_button.classList.add("active_view");
    stop_info_button.classList.remove("active_view");

    directions_section.style.display = "none";
    stop_info_section.style.display = "none";
    favourites_section.style.display = "initial";

    if(favourites_section.innerHTML === ""){
        favourites_section.innerHTML = `
            <form action="Getinput" method="get">
                <div class="grid-x">
                    <div class="cell small-9 medium-9">
                        <input type="text" name="set_home" id="set_home" placeholder="Enter Key">
                    </div>
                    <div class="cell small-3 medium-3">
                        <button tabindex="-1" onclick="clearSearch('set_home')"><img id="clear_search_icon" title="Clear origin search" src="/static/map/images/clear_search.png"></button>
                    </div>
                    <div class="cell small-9 medium-9">
                        <input type="text" name="set destination" id="set_destination" placeholder="Enter Location">
                    </div>
                    <div class="cell small-3 medium-3">
                        <button tabindex="-1" onclick="clearSearch('set_destination')"><img id="clear_search_icon" title="Clear destination search" src="/static/map/images/clear_search.png"></button>
                    </div>
                    <div class="cell small-3 medium-3">
                        <input type="button" id="set_favourites" value="Save Favourite">
                    </div>
                </div>
            </form>`;
        capture_favourites();
    }

}