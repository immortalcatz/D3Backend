/*
 * D3Backend
 * Copyright (C) 2015 - 2016  Dries007 & Double Door Development
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package net.doubledoordev.backend.util;

import com.flowpowered.nbt.*;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import java.util.LinkedList;
import java.util.Map;

import static net.doubledoordev.backend.util.Constants.JSONPARSER;

/**
 * @author Dries007
 */
public class JsonNBTHelper
{
    /**
     * To avoid idiocy later we need to store all things as a string with the type in the string. :(
     */
    public static JsonElement parseNBT(Tag element)
    {
        switch (element.getType())
        {
            // 0 = END
            case TAG_BYTE:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_SHORT:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_INT:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_LONG:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_FLOAT:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_DOUBLE:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_BYTE_ARRAY:
                return parseNBT((ByteArrayTag) element);
            case TAG_STRING:
                return new JsonPrimitive(element.getType().getTypeName() + ":" + element.getValue());
            case TAG_LIST:
                return parseNBT((ListTag<? extends Tag<?>>) element);
            case TAG_COMPOUND:
                return parseNBT((CompoundTag) element);
            case TAG_INT_ARRAY:
                return parseNBT((IntArrayTag) element);
            case TAG_SHORT_ARRAY:
                return parseNBT((ShortArrayTag) element);
            default:
                return null;
        }
    }

    public static JsonPrimitive parseNBT(ByteArrayTag nbtArray)
    {
        JsonArray jsonArray = new JsonArray();
        for (byte b : nbtArray.getValue()) jsonArray.add(new JsonPrimitive(b));
        return new JsonPrimitive(nbtArray.getType().getTypeName() + jsonArray.toString());
    }

    public static JsonArray parseNBT(ListTag<? extends Tag<?>> nbtArray)
    {
        JsonArray jsonArray = new JsonArray();
        for (Tag<?> element : nbtArray.getValue()) jsonArray.add(parseNBT(element));
        return jsonArray;
    }

    public static JsonObject parseNBT(CompoundTag compound)
    {
        JsonObject jsonObject = new JsonObject();
        for (Map.Entry<String, Tag<?>> entry : compound.getValue().entrySet()) jsonObject.add(entry.getKey(), parseNBT(entry.getValue()));
        return jsonObject;
    }

    public static JsonPrimitive parseNBT(IntArrayTag nbtArray)
    {
        JsonArray jsonArray = new JsonArray();
        for (int i : nbtArray.getValue()) jsonArray.add(new JsonPrimitive(i));
        return new JsonPrimitive(nbtArray.getType().getTypeName() + ":" + jsonArray.toString());
    }

    public static JsonPrimitive parseNBT(ShortArrayTag nbtArray)
    {
        JsonArray jsonArray = new JsonArray();
        for (short i : nbtArray.getValue()) jsonArray.add(new JsonPrimitive(i));
        return new JsonPrimitive(nbtArray.getType().getTypeName() + ":" + jsonArray.toString());
    }

    public static Tag parseJSON(JsonElement element)
    {
        if (element.isJsonObject()) return parseJSON(element.getAsJsonObject());
        else if (element.isJsonArray()) return parseJSON(element.getAsJsonArray());
        else if (element.isJsonPrimitive()) return parseJSON(element.getAsJsonPrimitive());

        return null;
    }

    /**
     * There is no way to detect number types and NBT is picky about this. Lets hope the original type id is there, otherwise we are royally screwed.
     */
    public static Tag parseJSON(JsonPrimitive element)
    {
        String string = element.getAsString();
        if (string.contains(":"))
        {
            String[] split = string.split(":", 2);
            switch (TagType.getByTypeName(split[0]))
            {
                case TAG_END:
                    return new EndTag();
                case TAG_BYTE:
                    return new ByteTag("", Byte.parseByte(split[1]));
                case TAG_SHORT:
                    return new ShortTag("", Short.parseShort(split[1]));
                case TAG_INT:
                    return new IntTag("", Integer.parseInt(split[1]));
                case TAG_LONG:
                    return new LongTag("", Long.parseLong(split[1]));
                case TAG_FLOAT:
                    return new FloatTag("", Float.parseFloat(split[1]));
                case TAG_DOUBLE:
                    return new DoubleTag("", Double.parseDouble(split[1]));
                case TAG_BYTE_ARRAY:
                    return parseJSONByteArray(split[1]);
                case TAG_STRING:
                    return new StringTag("", split[1]);
                // TAG_LIST != JsonPrimitive
                // TAG_COMPOUND != JsonPrimitive
                case TAG_INT_ARRAY:
                    return parseJSONIntArray(split[1]);
                case TAG_SHORT_ARRAY:
                    return parseJSONShortArray(split[1]);
            }
        }

        // Now it becomes guesswork.
        if (element.isString()) return new StringTag("", string);
        if (element.isBoolean()) return new ByteTag("", element.getAsBoolean());

        Number n = element.getAsNumber();
        if (n instanceof Byte) return new ByteTag("", n.byteValue());
        if (n instanceof Short) return new ShortTag("", n.shortValue());
        if (n instanceof Integer) return new IntTag("", n.intValue());
        if (n instanceof Long) return new LongTag("", n.longValue());
        if (n instanceof Float) return new FloatTag("", n.floatValue());
        if (n instanceof Double) return new DoubleTag("", n.doubleValue());

        try
        {
            return new IntTag("", Integer.parseInt(element.toString()));
        }
        catch (NumberFormatException ignored)
        {

        }
        throw new NumberFormatException(element.getAsNumber() + " is was not able to be parsed.");
    }

    public static ByteArrayTag parseJSONByteArray(String value)
    {
        JsonArray in = JSONPARSER.parse(value).getAsJsonArray();
        byte[] out = new byte[in.size()];
        for (int i = 0; i < in.size(); i++) out[i] = in.get(i).getAsByte();
        return new ByteArrayTag("", out);
    }

    public static IntArrayTag parseJSONIntArray(String value)
    {
        JsonArray in = JSONPARSER.parse(value).getAsJsonArray();
        int[] out = new int[in.size()];
        for (int i = 0; i < in.size(); i++) out[i] = in.get(i).getAsInt();
        return new IntArrayTag("", out);
    }

    public static CompoundTag parseJSON(JsonObject data)
    {
        CompoundMap map = new CompoundMap();
        for (Map.Entry<String, JsonElement> entry : data.entrySet()) map.put(entry.getKey(), parseJSON(entry.getValue()));
        return new CompoundTag("", map);
    }

    public static ListTag parseJSON(JsonArray data)
    {
        Class<? extends Tag> clazz;
        LinkedList<Tag> list = new LinkedList<>();
        for (JsonElement element : data) list.add(parseJSON(element));
        if (data.size() != 0) clazz = list.get(0).getClass();
        else clazz = Tag.class;
        return new ListTag("", clazz, list);
    }

    public static ShortArrayTag parseJSONShortArray(String value)
    {
        JsonArray in = JSONPARSER.parse(value).getAsJsonArray();
        short[] out = new short[in.size()];
        for (short i = 0; i < in.size(); i++) out[i] = in.get(i).getAsShort();
        return new ShortArrayTag("", out);
    }

    public static JsonElement fixNulls(JsonElement element)
    {
        if (element.isJsonNull()) return new JsonPrimitive("");
        if (element.isJsonObject()) return fixNulls(element.getAsJsonObject());
        if (element.isJsonArray()) return fixNulls(element.getAsJsonArray());
        if (element.isJsonPrimitive()) return fixNulls(element.getAsJsonPrimitive());
        return null;
    }

    public static JsonPrimitive fixNulls(JsonPrimitive primitive)
    {
        if (primitive.isBoolean()) return new JsonPrimitive(primitive.getAsBoolean());
        if (primitive.isNumber()) return new JsonPrimitive(primitive.getAsNumber());
        if (primitive.isString()) return new JsonPrimitive(primitive.getAsString());
        return JSONPARSER.parse(primitive.toString()).getAsJsonPrimitive();
    }

    public static JsonArray fixNulls(JsonArray array)
    {
        JsonArray newArray = new JsonArray();
        for (JsonElement element : array) newArray.add(fixNulls(element));
        return newArray;
    }

    public static JsonObject fixNulls(JsonObject object)
    {
        JsonObject newObject = new JsonObject();
        for (Map.Entry<String, JsonElement> entry : object.entrySet()) newObject.add(entry.getKey(), fixNulls(entry.getValue()));
        return newObject;
    }
}
