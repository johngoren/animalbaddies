export default function importerAnimals(data) {

    return data.posts.map( obj => {
	var animal = {}
	var facts = {}

	animal.id = obj.id;
	animal.name = obj.title;
	animal.slug = obj.slug;
	animal.tags = obj.tags.map(entry => {
	    return entry.title
	})
	facts.good = obj.custom_fields.not_bastard_reason;
	facts.bad = obj.custom_fields.bastard_reason;

	animal.facts = facts;
	return animal;
    })

}
