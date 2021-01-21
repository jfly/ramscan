// Add any modules that we don't have type information for here.
// This is "Kind-of-terrible Fix #4" from https://blog.atomist.com/declaration-file-fix/

declare module "react-interactable";
declare module "react-native";
// @ts-ignore: Variable 'Restivus' implicitly has an 'any' type.
declare var Restivus;
