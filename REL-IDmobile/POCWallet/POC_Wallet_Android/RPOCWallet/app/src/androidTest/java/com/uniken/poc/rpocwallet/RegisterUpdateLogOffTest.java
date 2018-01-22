package com.uniken.poc.rpocwallet;


import android.support.test.espresso.ViewInteraction;
import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.test.suitebuilder.annotation.LargeTest;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import static android.support.test.espresso.Espresso.onView;
import static android.support.test.espresso.Espresso.pressBack;
import static android.support.test.espresso.action.ViewActions.*;
import static android.support.test.espresso.assertion.ViewAssertions.*;
import static android.support.test.espresso.matcher.ViewMatchers.*;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class RegisterUpdateLogOffTest {

    @Rule
    public ActivityTestRule<MainActivity> mActivityTestRule = new ActivityTestRule<>(MainActivity.class);

    @Test
    public void performTest20Time(){
        performTest(20);
    }

    public void performTest(int n){
        try {
            for (int i = 0; i < n; i++) {
                registerUpdateLogOffTest();
            }
        }
        catch (Exception e){}
    }

    public void registerUpdateLogOffTest() {
        ViewInteraction button = onView(
                allOf(withId(R.id.btnRegister),
                        childAtPosition(
                                allOf(withId(R.id.linear_container),
                                        childAtPosition(
                                                withId(R.id.include),
                                                1)),
                                0),
                        isDisplayed()));
        button.check(matches(isDisplayed()));

        ViewInteraction appCompatButton = onView(
                allOf(withId(R.id.btnRegister), withText("Register"),
                        childAtPosition(
                                allOf(withId(R.id.linear_container),
                                        childAtPosition(
                                                withId(R.id.include),
                                                1)),
                                0),
                        isDisplayed()));
        appCompatButton.perform(click());

        ViewInteraction appCompatEditText = onView(
                allOf(withId(R.id.txtLoginId),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText.perform(click());

        ViewInteraction appCompatEditText2 = onView(
                allOf(withId(R.id.txtLoginId),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText2.perform(click());

        ViewInteraction appCompatEditText3 = onView(
                allOf(withId(R.id.txtLoginId),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText3.perform(replaceText("husain6"), closeSoftKeyboard());

        ViewInteraction appCompatEditText4 = onView(
                allOf(withId(R.id.txtLoginId), withText("husain6"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText4.perform(pressImeActionButton());

        ViewInteraction appCompatEditText5 = onView(
                allOf(withId(R.id.card_no),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_card_no),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText5.perform(replaceText("123456"), closeSoftKeyboard());

        ViewInteraction appCompatEditText6 = onView(
                allOf(withId(R.id.card_no), withText("123456"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_card_no),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText6.perform(pressImeActionButton());

        ViewInteraction appCompatEditText7 = onView(
                allOf(withId(R.id.card_pin),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_card_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText7.perform(replaceText("1111"), closeSoftKeyboard());

        ViewInteraction appCompatEditText8 = onView(
                allOf(withId(R.id.card_pin), withText("1111"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_card_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText8.perform(pressImeActionButton());

        ViewInteraction appCompatEditText9 = onView(
                allOf(withId(R.id.regRPIN),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_reg_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText9.perform(replaceText("1111"), closeSoftKeyboard());

        ViewInteraction appCompatEditText10 = onView(
                allOf(withId(R.id.regRPIN), withText("1111"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_reg_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText10.perform(pressImeActionButton());

        ViewInteraction appCompatEditText11 = onView(
                allOf(withId(R.id.confRPIN),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_confirm_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText11.perform(replaceText("1111"), closeSoftKeyboard());

        ViewInteraction appCompatEditText12 = onView(
                allOf(withId(R.id.confRPIN), withText("1111"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_confirm_pin),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText12.perform(pressImeActionButton());

        ViewInteraction appCompatButton2 = onView(
                allOf(withId(R.id.btnDoRegister), withText("Register"),
                        childAtPosition(
                                allOf(withId(R.id.include),
                                        childAtPosition(
                                                withClassName(is("android.widget.RelativeLayout")),
                                                0)),
                                6),
                        isDisplayed()));
        appCompatButton2.perform(click());

        ViewInteraction appCompatEditText13 = onView(
                allOf(withId(R.id.txtAmount),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText13.perform(click());

        ViewInteraction appCompatEditText14 = onView(
                allOf(withId(R.id.txtAmount),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.input_layout_loginId),
                                        0),
                                0),
                        isDisplayed()));
        appCompatEditText14.perform(replaceText("1"), closeSoftKeyboard());

        ViewInteraction appCompatButton3 = onView(
                allOf(withId(R.id.btnAdd), withText("Add Amount"),
                        childAtPosition(
                                childAtPosition(
                                        withClassName(is("android.widget.RelativeLayout")),
                                        0),
                                4),
                        isDisplayed()));
        appCompatButton3.perform(click());

        pressBack();

        ViewInteraction appCompatButton4 = onView(
                allOf(withId(android.R.id.button1), withText("Yes"),
                        childAtPosition(
                                childAtPosition(
                                        withId(R.id.buttonPanel),
                                        0),
                                3)));
        appCompatButton4.perform(scrollTo(), click());

    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText("Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup && parentMatcher.matches(parent)
                        && view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}
