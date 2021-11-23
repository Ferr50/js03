function fillHeader() {
    document.querySelector('header h1').innerHTML = "Peregrine Falcon";
    document.querySelector('header p').innerHTML = "The peregrine falcon is best known for its diving speed during flight—which can reach more than 300 km (186 miles) per hour—making it not only the world's fastest bird but also THE world's fastest animal.";
}

function fillMain() {
    document.querySelector('main h2').innerHTML = "Habitat";
    document.querySelector('main p').innerHTML = "Historically, peregrine falcons nested along cliffs and river bluffs. Although these sites are still used today, peregrine falcons have found urban areas attractive for nesting. Large urban and industrial areas have an abundant prey base, a lack of great horned owls, and tall buildings which mimic cliff faces and offer relative solitude far above the streets.During migration, peregrines can be found almost anywhere, but marshes are likely spots because peregrines are attracted by shorebirds and waterfowl. The southern tip of Lake Michigan is the best place in Indiana to find peregrines because they become concentrated along shorelines during the fall migration from September to November.";

    document.querySelectorAll('img')[0].src = "images/hawk01.jpeg";
    document.querySelectorAll('a')[0].href = "https://www.hawkmountain.org/raptors/peregrine-falcon";

    document.querySelectorAll('img')[1].src = "images/hawk02.jpeg";
    document.querySelectorAll('a')[1].href = "https://www.peregrinefund.org/explore-raptors-species/falcons/peregrine-falcon";

    document.querySelectorAll('img')[2].src = "images/hawk03.jpeg";
    document.querySelectorAll('a')[2].href = "https://www.audubon.org/field-guide/bird/peregrine-falcon";

    document.querySelectorAll('img')[3].src = "images/hawk04.jpeg";
    document.querySelectorAll('a')[3].href = "https://www.in.gov/dnr/fish-and-wildlife/wildlife-resources/animals/peregrine-falcon/";
}

fillHeader();
fillMain();