import backIcon from '../../assets/icon_back.png';
import heartIcon from '../../assets/icon_heart.png';
import viewIcon from '../../assets/icon_view.png';
import heartEmpty from '../../assets/icon_heart_empty.png';
import heartPull from '../../assets/icon_heart_pull.png';
import styled from './RecipeDetail.module.css';

import { getFirestore, getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GroupedIngredientList from '../../components/recipedetailpage/GroupedIngredientList';

import RecipeSteps from './../../components/recipedetailpage/RecipeSteps';
import Comments from '../../components/recipedetailpage/Comments';
import CustomButton, {
	ButtonType,
} from '../../components/custombutton/CustomButton';
import useUserNickname from '../../hooks/useGetUserNickName';

interface RecipeTime {
	hours: number;
	minutes: number;
}

interface RecipeCreateTime {
	seconds: number;
	nanoseconds: number;
}

interface RecipeIngredient {
	name: string;
	volume: number | string;
}

interface RecipeStep {
	step_description: string;
	step_image_url: string | number;
}

interface Author {
	user_emain: string;
	user_nickname: string | undefined;
}

interface Recipe {
	recipe_name: string;
	recipe_create_time: RecipeCreateTime;
	recipe_time: RecipeTime;
	recipe_difficulty: string | number;
	recipe_ingredients: RecipeIngredient[];
	recipe_steps: RecipeStep[];
	recipe_tips: string;
	recipe_description: string;
	recipe_tags: [];

	thumbnail_url: string;
	hearts: number;
	views: number;
	author: Author;
}

export default function RecipeDetail() {
	const [recipeData, setRecipeData] = useState<Recipe | null>(null);
	const [isAuthor, setIsAuthor] = useState<boolean>(false);

	const recipeId = 'GwU5yV7JXylXb31HGvvj';

	const db = getFirestore();
	const auth = getAuth();
	const currentUser = auth.currentUser;
	const userNickName = useUserNickname(db);
	const navigate = useNavigate();

	const getRecipe = async () => {
		try {
			const docRef = doc(db, 'recipes', recipeId);
			const recipeDoc = await getDoc(docRef);

			if (recipeDoc.exists()) {
				const recipe = recipeDoc.data() as Recipe;
				setRecipeData(recipe);

				console.log(currentUser);

				if (currentUser && userNickName === recipe.author.user_nickname) {
					setIsAuthor(true);
				}
			} else {
				navigate('/404');
			}
		} catch (error) {
			navigate('/404');
			console.log('데이터 전송 오류', error);
		}
	};

	const recipeAuthor = recipeData?.author?.user_nickname;

	useEffect(() => {
		getRecipe();
	}, [db, navigate]);

	console.log(recipeData);

	// 작성한 날짜 데이터 받아오기
	function createTime(seconds: number | undefined): string {
		if (typeof seconds === 'undefined') {
			return '비어있는 값입니다.';
		}
		const date = new Date(seconds * 1000);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	const times = {
		seconds: recipeData?.recipe_create_time.seconds,
		nanoseconds: recipeData?.recipe_create_time.nanoseconds,
	};
	const formatDay = createTime(times.seconds);

	// 레시피 팁 데이터의 여부를 확인하고 있으면 데이터를 넣고, 없으면 문구를 넣는다.
	const recipeTip: () => string = () => {
		return recipeData?.recipe_tips
			? recipeData.recipe_tips
			: '추가 설명이 없습니다.';
	};

	return (
		<>
			<section className={styled.recipeDetailPage}>
				<h2 className={styled.srOnly}>레시피 디테일 페이지</h2>

				<nav>
					<div className={styled.imgWrap}>
						<img src={backIcon} alt="뒤로 가기" />
					</div>
					<ul className={styled.pageTitle}>
						<li className={styled.pointFont}>Special Cooking Recipe</li>
						<li>
							<em>{userNickName} 's</em> 레시피
						</li>
					</ul>

					{isAuthor && (
						<CustomButton
							btnType={ButtonType.Edit}
							color="orange"
							shape="rad10"
						>
							수정하기
						</CustomButton>
					)}
				</nav>

				<section className={styled.recipeTitle}>
					<h3>{recipeData?.recipe_name}</h3>

					<ul>
						<li>{formatDay}</li>
						<li>
							<img src={viewIcon} alt="조회수 아이콘" />
							{recipeData?.views}
						</li>
						<li>
							<img src={heartIcon} alt="좋아요 아이콘" />
							{recipeData?.hearts}
						</li>
					</ul>

					<p className={styled.recipeDescription}>
						{recipeData?.recipe_description}
					</p>

					<img src={recipeData?.thumbnail_url} alt="레시피 메인 이미지" />
				</section>

				<section className={styled.contents}>
					<h3 className={styled.srOnly}>레시피 디테일 콘텐츠</h3>

					<div className={styled.cookingInfo}>
						<div>
							<h4 className={styled.pointFont}>
								조리시간 <em>Cooking time</em>
							</h4>
							<p>
								{recipeData?.recipe_time.hours}시간{' '}
								{recipeData?.recipe_time.minutes}분{' '}
							</p>
						</div>

						<div>
							<h4 className={styled.pointFont}>
								난이도 <em>Difficulty level</em>
							</h4>
							<p>{recipeData?.recipe_difficulty}</p>
						</div>
					</div>

					<div className={styled.cookingList}>
						<h4 className={styled.pointFont}>
							레시피 <em>Recipe</em>
						</h4>

						<div>
							{recipeData && (
								<GroupedIngredientList
									ingredients={recipeData.recipe_ingredients}
									className={styled.cookingIngredientList}
								/>
							)}
						</div>
					</div>

					<div className={styled.cookingList}>
						<RecipeSteps recipeData={recipeData || { recipe_steps: [] }} />
					</div>

					<div className={styled.recipeTip}>
						<h4>레시피 팁 | Recipe Tip</h4>
						<div>{recipeTip()}</div>
					</div>

					<div className={styled.recipeTag}>
						<h4>레시피 태그 | Recipe Tag</h4>
						<p>{recipeData?.recipe_tags}</p>
					</div>
				</section>

				<section className={styled.comment}>
					<Comments recipeId={recipeId} recipeAuthor={recipeAuthor} />
				</section>
			</section>

			{/* <aside className={styled.stickyHeartIcon} onClick={toggleHeart}>
				<img src={isHearted ? heartPull : heartEmpty} alt="좋아요 아이콘" />
			</aside> */}
		</>
	);
}
