import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();
    private recipes: Recipe[] = [];
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Tasty Schnitzel', 
    //         'A super tasty Schnitzel - just awesome', 
    //         'https://th.bing.com/th/id/R.98b34bf5d1cf42f63fffaee51a3f4aeb?rik=MY2DZEHW0jRY%2bg&riu=http%3a%2f%2fwww.gasthof-lang.de%2fwp-content%2fgallery%2fblick-in-die-kueche%2fschnitzel.jpg&ehk=c9ewPjOunFS8CJxoy7rlB0%2fwwwypGMd0qwqQ%2bB59MtQ%3d&risl=&pid=ImgRaw&r=0',
    //         [
    //             new Ingredient('Meat', 1),
    //             new Ingredient('French Fries', 20)
    //         ]),
    //     new Recipe(
    //         'Big Fat Burger', 
    //         'What else you need to say?', 
    //         'https://th.bing.com/th/id/R.f8e7a0fb4cb6de6794a0e1d367d0b032?rik=ER9KhI94fa85GQ&riu=http%3a%2f%2fwallpapersdsc.net%2fwp-content%2fuploads%2f2016%2f09%2fBurger-Photos.jpg&ehk=yPw6GMpMd1%2bm8SgwN%2bHpDP4BDkOGEhc%2b45DQHVVo%2b34%3d&risl=&pid=ImgRaw&r=0',
    //         [
    //             new Ingredient('Buns', 2),
    //             new Ingredient('Meat', 1)
    //         ])
    //   ];

    constructor(private slService: ShoppingListService) { }

    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.slService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next(this.recipes.slice());
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next(this.recipes.slice());
    }
}