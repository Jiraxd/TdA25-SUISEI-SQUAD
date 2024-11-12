package com.tda25be.tda25be.deserializers;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;

public class DifficultyDeserializer extends JsonDeserializer {
    @Override
    public com.tda25be.tda25be.Enums.Difficulty deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getText().toLowerCase();
        return com.tda25be.tda25be.Enums.Difficulty.valueOf(value);
    }

}
